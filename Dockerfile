# Используйте образ Debian
FROM debian

# Обновите пакеты и установите необходимые зависимости
RUN apt-get update && apt-get install -y \
    nginx \
    snapd \
    nano \
    certbot

# Копируйте файлы вашего фронтенда в директорию nginx
COPY . /usr/share/nginx/html

# Запустите сервис Snapd
CMD ["service", "snapd", "start"]

# Экспонируйте порт 80 (по умолчанию для HTTP)
EXPOSE 80
EXPOSE 443