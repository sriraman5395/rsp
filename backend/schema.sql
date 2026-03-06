-- Create the database
CREATE DATABASE IF NOT EXISTS railway_markers;
USE railway_markers;

-- Create markers table
CREATE TABLE IF NOT EXISTS markers (
  id VARCHAR(255) PRIMARY KEY,
  lc_no VARCHAR(50),
  division VARCHAR(50),
  section VARCHAR(100),
  district VARCHAR(100),
  chainage VARCHAR(50),
  location VARCHAR(255),
  x DECIMAL(10, 2),
  y DECIMAL(10, 2),
  rob_rub_both VARCHAR(50),
  state_govt_agency VARCHAR(100),
  technical_details JSON,
  cost_details JSON,
  present_status JSON
);

-- Create marker_images table
CREATE TABLE IF NOT EXISTS marker_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marker_id VARCHAR(255),
  url VARCHAR(512),
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (marker_id) REFERENCES markers(id) ON DELETE CASCADE
);

-- Insert sample data (optional)
INSERT INTO marker_images (marker_id, url, caption) VALUES 
('MAS2MAS-GDR', 'https://picsum.photos/seed/railway1/800/600', 'Site Overview'),
('MAS2MAS-GDR', 'https://picsum.photos/seed/railway2/800/600', 'Construction Progress');
