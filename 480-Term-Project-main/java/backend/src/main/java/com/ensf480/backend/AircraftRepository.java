package com.ensf480.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// FlightRepository.java (Repository)
// FlightRepository.java (Repository)
public interface AircraftRepository extends JpaRepository<Aircraft, String> {
    // Add similar methods for other parameters
}
