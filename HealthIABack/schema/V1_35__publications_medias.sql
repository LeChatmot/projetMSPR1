CREATE TABLE IF NOT EXISTS publications_medias (
    id_publications_medias INT AUTO_INCREMENT PRIMARY KEY,
    id_publications INT NOT NULL,
    id_medias INT NOT NULL,
    FOREIGN KEY (id_publications) REFERENCES publications(id_publications),
    FOREIGN KEY (id_medias) REFERENCES medias(id_medias)
)