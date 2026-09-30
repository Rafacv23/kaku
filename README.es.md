# Kaku

[English](README.md) · Español

Aplicación web gamificada para aprender japonés: kana, repetición espaciada, diccionario y práctica de gramática.

Kaku cubre en un solo sitio el camino del principiante hasta el JLPT N5, en español y en inglés: ejercicios de kana, repaso de vocabulario con mazos propios y seleccionados, importación de mazos de Anki, un diccionario integrado, práctica de gramática y una lista de recursos. Todo alimenta un único sistema de progreso con XP, niveles, objetivo diario, rachas, logros y una clasificación global.

Kaku está en una fase temprana de desarrollo; la mayor parte de lo anterior aún no está construido.

## Desarrollo

Necesitas [Bun](https://bun.sh) y [Docker](https://docs.docker.com/get-docker/). No hacen falta cuentas externas ni secretos.

```sh
bun install
bun dev
```

`bun dev` arranca la base de datos local en Docker, aplica las migraciones pendientes y sirve la aplicación en http://localhost:5173. El resto de comandos está en el [README en inglés](README.md#development).

## Contribuir

Los avisos de errores, las correcciones de contenido y los pull requests son bienvenidos. Lee antes la [guía de contribución](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md). El código, los commits, los issues y la documentación se escriben en inglés.

- `dev` es la rama de integración. Abre los pull requests contra `dev`.
- `staging` es donde el mantenedor verifica `dev` contra la base de datos de staging. Solo recibe merges desde `dev`.
- `main` es lo que está en producción. Solo recibe merges desde `staging`.

Al subir cambios a `staging` o `main` se aplican las migraciones pendientes a la base de datos de ese entorno y después se despliega.

## Licencia

El código se publica bajo [AGPL-3.0](LICENSE). El contenido propio de Kaku es CC BY-NC-SA 4.0, y los datos derivados de JMdict y KANJIDIC siguen bajo CC BY-SA 4.0. Consulta [NOTICE.md](NOTICE.md) para los detalles y la atribución.
