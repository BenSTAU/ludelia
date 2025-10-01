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
  isMjPage = false,
  closeTable,
  setCloseTable
}) {
  return (
    <section height="auto" className="card cardCreationTable">
      <form onSubmit={handleSubmit}>
        <div className="mjHeader">
          <div>
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              type="text"
              className="titleInput"
              placeholder="Titre de la table"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div>
          <label htmlFor="id_utilisateur">Maître du jeu</label>
          <select
            id="id_utilisateur"
            value={id_utilisateur || ""}
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
        </div>

        <div className="mjBody">
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="descriptionInput"
              placeholder="Description de la table"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="start_at">Début</label>
            <input
              id="start_at"
              type="datetime-local"
              value={start_at}
              onChange={(e) => setStart_at(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="end_at">Fin</label>
            <input
              id="end_at"
              type="datetime-local"
              value={end_at}
              onChange={(e) => setEnd_at(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="categorie">Catégorie</label>
            <input
              id="categorie"
              type="text"
              placeholder="Catégorie de la table"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="nbr_places">Nombre de joueurs</label>
            <input
              id="nbr_places"
              type="number"
              min="1"
              max="20"
              value={nbr_places}
              onChange={(e) => setNbr_places(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="difficulte">Difficulté</label>
            <select
              id="difficulte"
              value={difficulte || ""}
              onChange={(e) => setDifficulte(e.target.value)}
            >
              <option value="">Sélectionner une difficulté</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          {isMjPage && (
            <div className="closeTable">
              <label htmlFor="closeTableid">Fermer la table</label>
              <input
                type="checkbox"
                checked={closeTable}
                onChange={() => setCloseTable(!closeTable)
                }
              />
            </div>
          )}
        </div>

        <div className="buttonGroupForm">
          <button type="submit" className="card cardLanding cta">
            {isMjPage ? "Modifier la table" : "Créer la table"}
          </button>
          <button
            type="button"
            className="card cardLanding ctaCancel"
            onClick={resetForm}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  );
}
