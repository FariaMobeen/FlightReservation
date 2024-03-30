package com.ensf480.backend;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.ensf480.backend.Ticket;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface TicketRepository extends CrudRepository<Ticket, String> {
    List<Ticket> findByUser(String user);
    List<Ticket> findByFlight(String flight);
}
