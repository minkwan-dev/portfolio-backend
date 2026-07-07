CREATE TABLE users {
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    thumbnailImg VARCHAR(2048) NULL,
    short_bio VARCHAR(255) NULL,
    provider VARCHAR(50) NULL,
    password VARCHAR(50) NULL,
    created_at t
    updated_at
}