server {
	listen 80;
	listen [::]:80;
	root /home/haoqing/www/hw01.teresewang.com;
	index index.html;
	server_name hw01.teresewang.com;
	location / {
		try_files $uri $uri/ =404;
	}
}
