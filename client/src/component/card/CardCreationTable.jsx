import "./styles/card.scss"

export default function CardCreationTable({
  handleSubmit,
  setNom,
  nom,
  setDescription,
  description,
  setStart_at,
  start_at,
  setEnd_at,
  end_at,
  setCategorie,
  categorie,
  setNbr_places,
  nbr_places,
  setDifficulte,
  difficulte,
  setId_utilisateur,
  id_utilisateur,
  mjs,
  resetForm,
}) {
  return (
    <section height="auto" className="card cardCreationTable">
      <form onSubmit={handleSubmit}>
        <div className="mjHeader">
          <div>
            <h2>Titre</h2>
            <input
              type="text"
              className="titleInput"
              placeholder="Titre de la table"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <h3>Maître du jeu</h3>
          <select
            value={id_utilisateur}
            onChange={(e) => setId_utilisateur(e.target.value)}
          >
            <option value="">Sélectionner un MJ</option>
            {mjs.map((mj) => (
              <option key={mj.id_utilisateur} value={mj.id_utilisateur}>
                {mj.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mjBody">
          <div>
            <h2>Description</h2>
            <textarea
              className="descriptionInput"
              placeholder="Description de la table"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <h2>Date et heure de début</h2>
            <input
              type="datetime-local"
              value={start_at}
              onChange={(e) => setStart_at(e.target.value)}
            />
          </div>

          <div>
            <h2>Date et heure de fin</h2>
            <input
              type="datetime-local"
              value={end_at}
              onChange={(e) => setEnd_at(e.target.value)}
            />
          </div>

          <div>
            <h2>Catégorie</h2>
            <input
              type="text"
              placeholder="Catégorie de la table"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
            />
          </div>

          <div>
            <h2>Nombre de joueurs</h2>
            <input
              type="number"
              min="1"
              max="20"
              value={nbr_places}
              onChange={(e) => setNbr_places(e.target.value)}
            />
          </div>

          <div>
            <h2>Difficulté</h2>
            <select
              name="difficulte"
              value={difficulte}
              onChange={(e) => setDifficulte(e.target.value)}
            >
              <option value="">Sélectionner une difficulté</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        <div className="buttonGroupForm">
          <button type="submit" className="card cardLanding cta">
            Créer la table
          </button>
          <button type="button" className="card cardLanding ctaCancel" onClick={resetForm}>
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
