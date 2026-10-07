import os
import shutil
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.post('/api/create-folder')
def create_folder():
    data = request.get_json(silent=True) or {}
    parent = (data.get('parent') or '').strip()
    name = (data.get('name') or '').strip()
    if not parent or not name:
        return jsonify(ok=False, message='Indique le dossier parent et le nom du nouveau dossier.'), 400
    if not os.path.isdir(parent):
        return jsonify(ok=False, message='Le dossier parent est invalide.'), 400
    try:
        path = os.path.join(parent, name)
        os.makedirs(path, exist_ok=True)
        return jsonify(ok=True, message='Dossier créé avec succès !', path=path)
    except Exception as e:
        return jsonify(ok=False, message=str(e)), 500

@app.post('/api/move')
def move_item():
    data = request.get_json(silent=True) or {}
    src = (data.get('source') or '').strip()
    dst = (data.get('destination') or '').strip()
    if not src or not dst:
        return jsonify(ok=False, message='Indique la source et la destination.'), 400
    if not os.path.exists(src):
        return jsonify(ok=False, message="L'élément source n'existe pas."), 404
    if not os.path.isdir(dst):
        return jsonify(ok=False, message='Le dossier de destination est invalide.'), 400
    try:
        result = shutil.move(src, dst)
        return jsonify(ok=True, message='Élément déplacé avec succès !', path=result)
    except Exception as e:
        return jsonify(ok=False, message=str(e)), 500

@app.get('/api/search')
def search_files():
    search_dir = request.args.get('directory', '').strip()
    keyword = request.args.get('keyword', '').strip().lower()
    if not search_dir or not os.path.isdir(search_dir):
        return jsonify(ok=False, message='Choisis un dossier de recherche valide.'), 400
    if not keyword:
        return jsonify(ok=False, message='Entre un nom de fichier ou un mot-clé.'), 400

    matches = []
    try:
        for root, _, files in os.walk(search_dir):
            for filename in files:
                if keyword in filename.lower():
                    matches.append(os.path.join(root, filename))
                    if len(matches) >= 200:
                        break
            if len(matches) >= 200:
                break
        return jsonify(ok=True, matches=matches)
    except Exception as e:
        return jsonify(ok=False, message=str(e)), 500

@app.post('/api/delete')
def delete_item():
    data = request.get_json(silent=True) or {}
    target = (data.get('target') or '').strip()
    if not target or not os.path.exists(target):
        return jsonify(ok=False, message='Le chemin indiqué est invalide.'), 400
    try:
        if os.path.isdir(target):
            shutil.rmtree(target)
        else:
            os.remove(target)
        return jsonify(ok=True, message='Suppression réussie !')
    except Exception as e:
        return jsonify(ok=False, message=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
