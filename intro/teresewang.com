server {
	listen 80;
	listen [::]:80;
	
	root /home/haoqing/www/teresewang.com;
	
	index index.html;

	server_name teresewang.com www.teresewang.com;
	
	location / {
		try_files $uri $uri/ =404;
	}
}
