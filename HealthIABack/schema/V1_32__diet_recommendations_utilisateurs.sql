CREATE TABLE IF NOT EXISTS diet_recommendations_utilisateurs (
    id_diet_recommendations_utilisateurs INT AUTO_INCREMENT PRIMARY KEY,
    id_diet_recommendations INT NOT NULL,
    id_utilisateurs INT NOT NULL,
    FOREIGN KEY (id_diet_recommendations) REFERENCES diet_recommendations(id_diet_recommendations),
    FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs)
)