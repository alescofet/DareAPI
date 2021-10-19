## Bienvenidos a mi prueba tecnica DARE Node.js

En primer lugar deberás clonar el proyecto en tu PC:
```bash
git clone https://github.com/alescofet/DareAPI
```

Despues deberás instalar las dependencias necesarias para que el proyecto funcione:

```bash
npm install
```

Por ultimo deberás iniciar el servidor:
```bash
npm run dev
```

Una vez iniciado puedes usar los siguientes endpoints mediante postman para que el servidor nos devuelva la información deseada:
[API documentation](https://documenter.getpostman.com/view/15459588/UV5XhchP)

Como podreis comprobar aunque tengo un JWT no he conseguido usar las rutas protegidas porque no consigo pasarle el header de authorization antes de que salte el middleware, pero si descomentas el middleware y le pasas el token mediante postman funciona perfectamente.

Tampoco he conseguido comprobar los etags para evitar llamadas a la API.

Para refrescar el token en caso de que caduque he hecho un interceptor que salta cuando hay error, comprueba si el codigo de error corresponde al token caducado, lo renueva y lo introduce en los headers del APIHandler.

Los tests no he conseguido que capten el header de authorization y no funcionan.

### *Developed by [Alex Escofet](https://github.com/alescofet)*

