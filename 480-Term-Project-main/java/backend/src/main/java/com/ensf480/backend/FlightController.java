package com.ensf480.backend;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

// FlightController.java (Controller)
@RestController
@RequestMapping("/api/flights")
@CrossOrigin() // Allow requests from your React app
public class FlightController {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    TicketController ticketController;

    @GetMapping(path = "/all")
    public @ResponseBody ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightRepository.findAll();
        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    // FlightController.java (Controller)
    @GetMapping(path = "/flights")
    public @ResponseBody ResponseEntity<List<Flight>> getFilteredFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String dest,
            @RequestParam(required = false) String departure_date,
            @RequestParam(required = false) String arrival_date,
            @RequestParam(required = false) String guests,
            @RequestParam(required = false) String seatType, @RequestParam(required = false) String returnDate) {

        // Implement logic to filter flights based on parameters
        List<Flight> flights = flightRepository.findByOriginAndDestinationAndDepartureDateAndReturnDate(origin, dest,
                departure_date, returnDate);

        return new ResponseEntity<>(flights, HttpStatus.OK);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteFlight(@PathVariable String id) {
        java.util.Optional<Flight> optionalFlight = flightRepository.findById(id);

        if (optionalFlight.isPresent()) {
            List<Ticket> ticketsToDelete = ticketRepository.findByFlight(id);
            for (Ticket ticket : ticketsToDelete) {
                // Call the deleteTicket method for each ticket
                System.out.println("a");
                ResponseEntity<String> deleteTicketResponse = ticketController.deleteTicket(ticket.getId());
            }
            flightRepository.deleteById(id);
            List<Seat> seatsToDelete = seatRepository.findByFlight(id);
            seatRepository.deleteAll(seatsToDelete);
            return new ResponseEntity<>("Aircraft deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Aircraft not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/add")
    public @ResponseBody ResponseEntity<String> addNewFlight(
            @RequestParam String id,
            @RequestParam String flightNumber,
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String departureDate,
            @RequestParam String departureTime,
            @RequestParam String aircraft,
            @RequestParam String ordinarySeats,
            @RequestParam String comfortSeats,
            @RequestParam String businessSeats,
            @RequestParam String returnDate,
            @RequestParam String ordinaryFare) {

        Flight n = new Flight();
        n.setId(id);
        n.setFlightNumber(flightNumber);
        n.setOrigin(origin);
        n.setDestination(destination);
        n.setDepartureDate(departureDate);
        n.setDepartureTime(departureTime);
        n.setArrival(origin);
        n.setAircraft(aircraft);
        n.setOrdinarySeats(ordinarySeats);
        n.setComfortSeats(comfortSeats);
        n.setBusinessSeats(businessSeats);
        n.setReturnDate(returnDate);
        n.changeCrew("");
        n.setOrdinaryFare(ordinaryFare); // Set ordinaryFare

        flightRepository.save(n);
        String[] seatTypes = { "business", "comfort", "ordinary" };
        String[] seatQuantities = { businessSeats, comfortSeats, ordinarySeats };
        char[] columns = { 'A', 'B', 'C', 'D' }; // Add more columns as needed
        int row = 1;
        int seatCount = 0;
        int seatOnRow = 0;
        for (int i = 0; i < 3; i++) {
            String seatType = seatTypes[i];
            String seatQuantity = seatQuantities[i];

            // Create seat entries in the database

            for (int j = 0; j < Integer.parseInt(seatQuantity); j++) {

                Seat seat = new Seat();
                seat.setId(UUID.randomUUID().toString()); // You can use your own logic to generate IDs
                seat.setCode(row + String.valueOf(columns[seatOnRow]));
                seat.setFlight(id); // Set the flight ID for the seat
                seat.setTaken(false);
                seat.setType(seatType);

                seatRepository.save(seat);

                seatCount++;
                if (seatCount / 4 > row && seatCount % 4 == 0) {
                    row++;
                }
                seatOnRow++;
                if (seatOnRow == 4) {
                    row++;
                    seatOnRow = 0;
                }
            }
            if (seatOnRow != 0) {
                row++;
                seatOnRow = 0;
            }
        }

        return ResponseEntity.ok("Flight saved successfully");
    }

    @PostMapping(path = "/changecrew")
    public @ResponseBody ResponseEntity<String> changeCrew(@RequestParam String id, @RequestParam String crew) {
        try {
            Optional<Flight> optionalFlight = flightRepository.findById(id);
            if (optionalFlight.isPresent()) {
                Flight flight = optionalFlight.get();
                flight.changeCrew(crew);
                flightRepository.save(flight);
                return ResponseEntity.ok("Crew updated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating crew");
        }
    }
}
