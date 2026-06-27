CREATE TABLE IF NOT EXISTS coach_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateurs INT NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utilisateurs) REFERENCES utilisateurs(id_utilisateurs) ON DELETE CASCADE
);
