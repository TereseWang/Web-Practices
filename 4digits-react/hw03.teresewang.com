server {
	listen 80;
	listen [::]:80;
	root /home/haoqing/www/build;
	index index.html;
	server_name hw03.teresewang.com;
	location / {
		try_files $uri $uri/ =404;
	}	
}
