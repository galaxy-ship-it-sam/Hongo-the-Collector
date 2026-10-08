HONGO THE COLLECTOR - VERSION WEB

1. Ouvre CMD dans le dossier Hongo_Web.
2. Installe Flask :
   pip install -r requirements.txt
3. Lance le programme :
   python app.py
4. Ouvre dans ton navigateur :
   http://127.0.0.1:5000

si ca ne marche pas tape ces commandes dans cmd

1. Installe Flask :
py -m pip install flask
2. Lance le programme :
py app.py
Ouvre dans ton navigateur :
   http://127.0.0.1:5000

Le programme garde les fonctions du projet original :
- créer un dossier
- déplacer un fichier ou dossier
- rechercher un fichier
- supprimer un fichier ou dossier

Important : l'interface web demande des chemins Windows complets. Pour des raisons de sécurité, un navigateur web ne peut pas fournir librement à Python le chemin réel d'un dossier local via un simple bouton de sélection comme Tkinter.
