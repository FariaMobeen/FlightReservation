package com.ensf480.backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

// FlightRepository.java (Repository)
// FlightRepository.java (Repository)
public interface FlightRepository extends JpaRepository<Flight, String> {
    List<Flight> findByOriginAndDestinationAndDepartureDateAndReturnDate(
            String origin, String destination, String departureDate, String returnDate);
}