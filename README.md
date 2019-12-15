# WeatherApp

> Aplicación para visualizar el clima actual desarrollada con Nativescript-Vue.

## Comenzando

Para poder compilar y ejecutar el proyecto se necesita preparar el sistema siguiendo los pasos descriptos [aquí](https://nativescript-vue.org/en/docs/getting-started/installation/).

Una vez configurado el sistema, es necesario crear un archivo llamado config.js a partir del archivo config.js.example. En este archivo se debe configurar la API key utilizada para consumir la API de [OpenWeatherMap](https://openweathermap.org/). Para obtenerla, se puede seguir esta [guía](https://openweathermap.org/guide).

Como siguiente paso, deben instalarse las dependencias del proyecto:

``` bash
# Instalar dependencias
npm install
```

## Compilar y ejecutar la aplicación

Una vez instanciado el proyecto, los siguientes comandos pueden ser de utilidad:

``` bash
# Previsualizar en un dispositivo
tns preview

# Compilar la aplicación y ejecutarla en un emulador escuchando los cambios.
tns run

# Compilar, escuchar los cambios y debuggear la aplicación
tns debug <platform>

# Compilar para producción
tns build <platform> --env.production

```
