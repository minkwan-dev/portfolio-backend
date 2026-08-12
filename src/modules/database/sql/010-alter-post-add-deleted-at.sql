ALTER TABLE post
  ADD deleted_at DATETIME(6) NULL AFTER updated_at;
