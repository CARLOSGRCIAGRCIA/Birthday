# start.sh
#!/data/data/com.termux/files/usr/bin/bash

# Actualizar paquetes
pkg update -y && pkg upgrade -y

# Instalar Python si no está instalado
pkg install python -y

# Lanzar el servidor web
python3 -m http.server 8080
