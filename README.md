# Déploiement du projet TOT
Sujet Alzheimer

# Installation de l’application
Avant de pouvoir lancer l’application, il est nécessaire d’effectuer la commande `npm install` dans les différentes parties de notre projet, c’est dire les dossiers :
-	TTO-Client-Ordi
-	TTO-Client-Table
-	TTO-Client-Touchpad
-	TTO-Server-master
Notre serveur a besoin d’une base de données MongoDB pour pouvoir s’exécuter. 

# Configuration de l’application

Pour que l’application fonctionne correctement, les différentes parties doivent pouvoir se connecter au serveur. Par conséquent, il faudra surement aller modifier certains fichiers qui définissent l’adresse IP du serveur.
Voilà la liste des fichiers concernés :
-	TTO-Client-Ordi/src/component/config/config.js
-	TTO-Client-Ordi/src/App.js
-	TTO-Client-Table/src/DivWidget/DivWidget.js
-	TTO-Client-Table/src/index.js
-	TTO-Client-Touchpad/src/constants.js

Pour lancer l’application sur la table, il faut aussi modifier l’adresse IP de l’host dans :
-	TTO-Client-Table/webpack.common.js

-	{
-	    mode: 'development',
-	    devServer: {
-	      inline: true,
-	      historyApiFallback: true,
-	      port: 3000,
-	      host: '192.168.1.16',
-	    }



# Lancement de l’application

Pour lancer l’application, il faut effectuer la commande `npm start` dans les différentes parties de notre projet, c’est dire les dossiers :
-	TTO-Client-Ordi
-	TTO-Client-Table
-	TTO-Client-Touchpad
-	TTO-Server-master
Les applications seront disponibles via un navigateur en rentrant comme url :
http://<adresse_ip>:<port>
ex : http://10.189.30.102:3000
Habituellement les ports utilisés par notre application sont 	3000 ; 3001 ; 3002 
