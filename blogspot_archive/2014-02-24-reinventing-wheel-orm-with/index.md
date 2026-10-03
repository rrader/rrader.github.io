---
title: "Reinventing the wheel: \"ORM\" with PropertiesConfiguration"
date: 2014-02-24T10:55:00.001+02:00
lastmod: 2014-02-24T10:57:49.188+02:00
original_url: "https://antigluk.blogspot.com/2014/02/reinventing-wheel-orm-with.html"
tags: ["databases", "english", "java", "ORM", "reinventing the wheel"]
draft: true
migrated_from: blogspot
---

## "ORM" with PropertiesConfiguration

It was interesting to try creating simple database (I needed to store different objects/tables in single key-value storage, that was temporary and quite reasonable for that situation), based on 'properties' file.\
\
Dependencies\
1) Useful *gson* library to convert beans to/from json (**serialization**)\
<https://code.google.com/p/google-gson/>\
\
2) *PropertiesConfiguration* class is just like Properties but supports auto saving and reloading from file (**persistence**)\
<http://commons.apache.org/proper/commons-configuration/apidocs/org/apache/commons/configuration/PropertiesConfiguration.html>\
\
\
Building ORM:\
\
**1. Let's create our key-value storage:**\
\
\
public class PersistentConfiguration extends PropertiesConfiguration {\
    public PersistentConfiguration(String fileName) throws ConfigurationException {\
        super();\
\
        File config = new File(fileName);\
        setFile(config);\
        this.setAutoSave(true);\
        this.setReloadingStrategy(new FileChangedReloadingStrategy());\
        this.setDelimiterParsingDisabled(true);\
        this.setListDelimiter((char) 0);\
\
        if (config.exists()) {\
            this.load();\
        }\
    }\
}\
\
It's file based storage. Since we need to store json, need to make it not treat commas as list separators.\
\
2.\
\
To store objects we need every object to have ID, and store last created index to avoid collisions after deleting some elements.\
\
Let's use "\<class name\>:index" key name for last index, and\
"\<class name\>:\<id\>" for table rows (see getIndexPropertyName and getItemPropertyName in Storage)\
\
Our beans should implement this interface, to be sure we can access ID of row:\
public interface Indexed {\
    String getId();\
    void setId(String id);\
}\
\
And finally, the storage:\
\
public class Storage {\
    protected final Gson gson = new Gson();\
    private PersistentConfiguration config = null;\
\
    public PigStorage() {\
        try {\
            config = new PersistentConfiguration("./data.properties");\
        } catch (ConfigurationException e) {\
            e.printStackTrace();\
        }\
    }\
\
    public synchronized void store(Indexed obj) {\
        String modelIndexingPropName = getIndexPropertyName(obj.getClass());\
\
        if (obj.getId() == null) {\
            int lastIndex = config.getInt(modelIndexingPropName, 0);\
            lastIndex ++;\
            config.setProperty(modelIndexingPropName, lastIndex);\
            obj.setId(Integer.toString(lastIndex));\
        }\
\
        String modelPropName = getItemPropertyName(obj.getClass(), Integer.parseInt(obj.getId()));\
        String json = gson.toJson(obj);\
        config.setProperty(modelPropName, json);\
    }\
\
    public synchronized Indexed load(Class model, int id) throws ItemNotFound {\
        String modelPropName = getItemPropertyName(model, id);\
        if (config.containsKey(modelPropName)) {\
            String json = config.getString(modelPropName);\
            return (Indexed) gson.fromJson(json, model);\
        } else {\
            throw new ItemNotFound();\
        }\
    }\
\
    public synchronized void delete(Class model, int id) {\
        String modelPropName = getItemPropertyName(model, id);\
        config.clearProperty(modelPropName);\
    }\
\
    public boolean exists(Class model, int id) {\
        return config.containsKey(getItemPropertyName(model, id));\
    }\
\
\
    private String getIndexPropertyName(Class model) {\
        return String.format("%s:index", model.getName());\
    }\
\
    private String getItemPropertyName(Class model, int id) {\
        return String.format("%s.%d", model.getName(), id);\
    }\
}\
\
**Done!**\
\
**Improvements:**\
making SELECT with filtering**\**
\
    public synchronized List loadAll(Class model, FilteringStrategy filter) {\
        ArrayList\<Indexed\> list = new ArrayList\<Indexed\>();\
        String modelIndexingPropName = getIndexPropertyName(model);\
        LOG.info(String.format("Loading all %s-s", model.getName()));\
        int lastIndex = getConfig().getInt(modelIndexingPropName, 0);\
        for(int i=1; i\<=lastIndex; i++) {\
            try {\
                Indexed item = load(model, i);\
                if ((filter == null) \|\| filter.is_conform(item)) {\
                    list.add(item);\
                }\
            } catch (ItemNotFound ignored) {\
            }\
        }\
        return list;\
    }\
\
Where FilteringStrategy is:\
\
public interface FilteringStrategy {\
    boolean is_conform(Indexed item);\
}\
\
For example:\
public class OnlyOwnersFilteringStrategy implements FilteringStrategy {\
    private final String username;\
\
    public OnlyOwnersFilteringStrategy(String username) {\
        this.username = username;\
    }\
\
    \@Override\
    public boolean is_conform(Indexed item) {\
        Owned object = (Owned) item;\
        return object.getOwner().compareTo(username) == 0;\
    }\
}
