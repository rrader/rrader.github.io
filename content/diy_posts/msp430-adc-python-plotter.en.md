---
title: "Plotting Live Data from MSP430 ADC in Python"
date: 2014-07-15T14:01:00+03:00
draft: false
tags: ["diy", "hardware", "msp430", "launchpad", "python", "c", "matplotlib", "serial"]
---

I've finally got something for post.

Last month I've been playing with the **TI MSP430 Launchpad** and when I work with ADC it lacks of visualization. Since Launchpad have UART-USB interface, I decided to plot incoming data.

*I'm using MSP430G2553, and all code was written for this controller.*

![TI MSP430 Launchpad](/images/msp430-adc/image-01.png)

---

## 1. Microcontroller Firmware

The high-level firmware logic on the microcontroller is straightforward: it continuously reads the ADC value and outputs it over UART. However, there is a critical step: before streaming data, the device performs a handshake to verify that the host machine is ready to listen.

High-level workflow:
1. Initialize UART (9600 baud) and ADC (channel 10 — internal temperature sensor).
2. Wait for a start signal ("handshake").
3. In an infinite loop, read temperature in Celsius and transmit the reading via UART.

### ADC Initialization (Internal Temperature Sensor Channel):
```c
void ADC_init(void) {
    ADC10CTL0 = SREF_1 + REFON + ADC10ON + ADC10SHT_3;
    ADC10CTL1 = INCH_10 + ADC10DIV_3;
}

int getTemperatureCelsius() {
    int t = 0;
    __delay_cycles(1000);
    ADC10CTL0 |= ENC + ADC10SC;
    while (ADC10CTL1 & BUSY);
    t = ADC10MEM;
    ADC10CTL0 &= ~ENC;
    return (int) ((t * 27069L - 18169625L) >> 16);  // Conversion to Celsius
}
```

### Connection Handshake:
```c
unsigned char c;
while ((c = uart_getc()) != '1');
uart_puts((char *)"\nOK\n");
```
The controller waits for the character `'1'` and responds with `"OK"`.

Once established, continuous telemetry streaming begins:
```c
while(1) {
    uart_printf("%i\n", getTemperatureCelsius());
    P1OUT ^= 0x1;
}
```
The helper function `uart_printf` formats integers into ASCII and dispatches them across the serial line.

---

## 2. Desktop Plotting Application (Python)

To visualize streaming time-series data in Python, `matplotlib` is an ideal tool, paired with `pySerial` for serial bus communications.

When the Launchpad is connected to a Linux host, a virtual serial interface is exposed at `/dev/ttyACM0`.

The application runs two concurrent threads:
1. **Serial Port Listener:** Reads bytes from the port and populates a ring buffer.
2. **Plot Render Loop:** Continuously animates the chart via `matplotlib.animation.FuncAnimation`.

### Serial Port Processing
A global circular buffer `data = deque(0 for _ in range(5000))` holds incoming raw measurements, while `dataP = deque(0 for _ in range(5000))` holds smoothed values.

The serial thread initializes the connection and performs the handshake:
```python
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ok = b''
while ok.strip() != b'OK':
    ser.write(b"1")
    ok = ser.readline()
print("Handshake OK!\n")
```

Once confirmed, the loop consumes sensor frames:
```python
while True:
    try:
        val = int(ser.readline().strip())
        addValue(val)
    except ValueError:
        pass
```
Because serial lines can introduce transmission artifacts, malformed frames that trigger `ValueError` are safely dropped.

The `addValue` routine computes an Exponential Moving Average (EMA) to smooth noise:
```python
avg = 0
def addValue(val):
    global avg
    data.append(val)
    data.popleft()
    avg = avg + 0.1 * (val - avg)
    dataP.append(avg)
    dataP.popleft()
```

Smoothing formula:

![Smoothing formula](/images/msp430-adc/image-02.png)

### Real-Time Animation
We configure a dual-pane figure comparing raw signal against filtered output:

```python
fig, (p1, p2) = plt.subplots(2, 1)
plot_data, = p1.plot(data, animated=True)
plot_processed, = p2.plot(data, animated=True)
p1.set_ylim(0, 100)
p2.set_ylim(0, 100)

def animate(i):
    plot_data.set_ydata(data)
    plot_data.set_xdata(range(len(data)))
    plot_processed.set_ydata(dataP)
    plot_processed.set_xdata(range(len(dataP)))
    return [plot_data, plot_processed]

ani = animation.FuncAnimation(fig, animate, range(10000), interval=50, blit=True)
plt.show()
```

The resulting real-time visualization:

![Real-time live telemetry plot](/images/msp430-adc/image-03.png)

The top graph displays raw integer ADC readings; the bottom graph displays the moving average.

---

## 3. Complete Source Code

### Python Host Script (`plotter.py`)
```python
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import serial
import threading
from collections import deque

data = deque(0 for _ in range(5000))
dataP = deque(0 for _ in range(5000))
avg = 0

def addValue(val):
    global avg
    data.append(val)
    data.popleft()
    avg = avg + 0.1 * (val - avg)
    dataP.append(avg)
    dataP.popleft()

def msp430():
    print("Connecting...")
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    print("Connected!")

    # Handshake...
    ok = b''
    while ok.strip() != b'OK':
        ser.write(b"1")
        ok = ser.readline()
        print(ok.strip())
    print("Handshake OK!\n")

    while True:
        try:
            val = int(ser.readline().strip())
            addValue(val)
            print(val)
        except ValueError:
            pass

if __name__ == "__main__":
    threading.Thread(target=msp430).start()

    fig, (p1, p2) = plt.subplots(2, 1)
    plot_data, = p1.plot(data, animated=True)
    plot_processed, = p2.plot(data, animated=True)
    p1.set_ylim(0, 100)
    p2.set_ylim(0, 100)

    def animate(i):
        plot_data.set_ydata(data)
        plot_data.set_xdata(range(len(data)))
        plot_processed.set_ydata(dataP)
        plot_processed.set_xdata(range(len(dataP)))
        return [plot_data, plot_processed]

    ani = animation.FuncAnimation(fig, animate, range(10000), interval=50, blit=True)
    plt.show()
```

### MSP430 C Firmware (`main.c`)
```c
#include <msp430g2553.h>
#include <legacymsp430.h>
#include <stdarg.h>

// Function prototypes
void uart_init(void);
void uart_set_rx_isr_ptr(void (*isr_ptr)(unsigned char c));
unsigned char uart_getc();
void uart_putc(unsigned char c);
void uart_puts(const char *str);
void uart_printf(char *, ...);
void ADC_init(void);
int getTemperatureCelsius(void);

void uart_rx_isr(unsigned char c) {
    P1OUT ^= 0x40;
}

int main(void) {
    WDTCTL = WDTPW + WDTHOLD;

    BCSCTL1 = CALBC1_8MHZ; // 8 MHz DCO
    DCOCTL = CALDCO_8MHZ;

    P1DIR = 0xff;
    P1OUT = 0x1;
    ADC_init();
    uart_init();
    uart_set_rx_isr_ptr(uart_rx_isr);

    __bis_SR_register(GIE); // Global interrupt enable

    // UART Handshake
    unsigned char c;
    while ((c = uart_getc()) != '1');
    uart_puts((char *)"\nOK\n");

    ADC10CTL0 |= ADC10SC;
    while(1) {
        uart_printf("%i\n", getTemperatureCelsius());
        P1OUT ^= 0x1;
    }
}

void ADC_init(void) {
    ADC10CTL0 = SREF_1 + REFON + ADC10ON + ADC10SHT_3;
    ADC10CTL1 = INCH_10 + ADC10DIV_3;
}

int getTemperatureCelsius(void) {
    int t = 0;
    __delay_cycles(1000);
    ADC10CTL0 |= ENC + ADC10SC;
    while (ADC10CTL1 & BUSY);
    t = ADC10MEM;
    ADC10CTL0 &= ~ENC;
    return (int) ((t * 27069L - 18169625L) >> 16);
}

// UART implementation
#define RXD BIT1
#define TXD BIT2

void (*uart_rx_isr_ptr)(unsigned char c);

void uart_init(void) {
    uart_set_rx_isr_ptr(0L);
    P1SEL = RXD + TXD;
    P1SEL2 = RXD + TXD;

    UCA0CTL1 |= UCSSEL_2; // SMCLK
    // 8,000,000 Hz, 9600 Baud
    UCA0BR0 = 52;
    UCA0BR1 = 0;
    UCA0MCTL = 0x10 | UCOS16;
    UCA0CTL1 &= ~UCSWRST;
    IE2 |= UCA0RXIE;
}

void uart_set_rx_isr_ptr(void (*isr_ptr)(unsigned char c)) {
    uart_rx_isr_ptr = isr_ptr;
}

unsigned char uart_getc(void) {
    while (!(IFG2 & UCA0RXIFG));
    return UCA0RXBUF;
}

void uart_putc(unsigned char c) {
    while (!(IFG2 & UCA0TXIFG));
    UCA0TXBUF = c;
}

void uart_puts(const char *str) {
    while (*str) uart_putc(*str++);
}

interrupt(USCIAB0RX_VECTOR) USCI0RX_ISR(void) {
    if (uart_rx_isr_ptr != 0L) {
        (uart_rx_isr_ptr)(UCA0RXBUF);
    }
}

// Lightweight embedded uart_printf
static const unsigned long dv[] = {
    1000000000, 100000000, 10000000, 1000000, 100000,
    10000, 1000, 100, 10, 1
};

static void xtoa(unsigned long x, const unsigned long *dp) {
    char c;
    unsigned long d;
    if (x) {
        while (x < *dp) ++dp;
        do {
            d = *dp++;
            c = '0';
            while (x >= d) ++c, x -= d;
            uart_putc(c);
        } while (!(d & 1));
    } else {
        uart_putc('0');
    }
}

static void puth(unsigned n) {
    static const char hex[16] = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
    uart_putc(hex[n & 15]);
}

void uart_printf(char *format, ...) {
    char c;
    int i;
    long n;
    va_list a;
    va_start(a, format);
    while ((c = *format++)) {
        if (c == '%') {
            switch (c = *format++) {
                case 's': uart_puts(va_arg(a, char*)); break;
                case 'c': uart_putc(va_arg(a, char)); break;
                case 'i':
                case 'u':
                    i = va_arg(a, int);
                    if (c == 'i' && i < 0) i = -i, uart_putc('-');
                    xtoa((unsigned)i, dv + 5);
                    break;
                case 'l':
                case 'n':
                    n = va_arg(a, long);
                    if (c == 'l' && n < 0) n = -n, uart_putc('-');
                    xtoa((unsigned long)n, dv);
                    break;
                case 'x':
                    i = va_arg(a, int);
                    puth(i >> 12);
                    puth(i >> 8);
                    puth(i >> 4);
                    puth(i);
                    break;
                case 0: return;
                default: goto bad_fmt;
            }
        } else {
bad_fmt:    uart_putc(c);
        }
    }
    va_end(a);
}
```

---

## References & Acknowledgments
* [1] UART: Stefan Wendler — *gpio.kaltpost.de*
* [2] ADC: *Using the internal temperature sensor on MSP430*
* [3] printf: *Tiny printf C version for MSP430 (43oh forum)*

---

*This post was migrated from the legacy blog [antigluk.blogspot.com](https://antigluk.blogspot.com/2014/07/plotting-live-data-from-msp430-adc-in.html).*
