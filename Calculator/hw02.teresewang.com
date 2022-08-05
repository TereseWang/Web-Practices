server {
	listen 80;
	listen [::]:80;
	root /home/haoqing/www/hw02.teresewang.com;
	index index.html;
	server_name hw02.teresewang.com;
	location / {
		try_files $uri $uri/ =404;
	}
}
