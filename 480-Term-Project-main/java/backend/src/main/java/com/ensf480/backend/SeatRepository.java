package com.ensf480.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ensf480.backend.Ticket;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface SeatRepository extends CrudRepository<Seat, String> {
    List<Seat> findByFlight(String flight);

    Optional<Seat> findById(String id);
}
