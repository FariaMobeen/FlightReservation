package com.ensf480.backend;

import java.util.List;

import org.apache.el.stream.Optional;
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
@RequestMapping("/ticket")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class TicketController {
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Ticket> getAllUsers() {
        // This returns a JSON or XML with the users
        return ticketRepository.findAll();
    }

    @GetMapping(path = "/{user}")
    public @ResponseBody Iterable<Ticket> getUserTickets(@PathVariable String user) {
        // This returns a JSON or XML with the users
        return ticketRepository.findByUser(user);
    }

    @GetMapping(path = "/flight/{flight}")
    public @ResponseBody Iterable<Ticket> getFlightTickets(@PathVariable String flight) {
        // This returns a JSON or XML with the users
        return ticketRepository.findByFlight(flight);
    }

    @PostMapping(path = "/add") // Map ONLY POST Requests
    public @ResponseBody ResponseEntity<String> addNewUser(@RequestParam String Id, @RequestParam String flight,
            @RequestParam String seat, @RequestParam String user, @RequestParam String type,
            @RequestParam String seatcode, @RequestParam String origin, @RequestParam String dest,
            @RequestParam String depature, @RequestParam String time, @RequestParam String name,
            @RequestParam String email, @RequestParam String price, @RequestParam String card) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Ticket n = new Ticket();
        n.setId(Id);
        n.setFlight(flight);
        n.setSeat(seat);
        n.setUser(user);
        n.setSeatcode(seatcode);
        n.setOrigin(origin);
        n.setDest(dest);
        n.setDepature(depature);
        n.setTime(time);
        n.setName(name);
        n.setEmail(email);
        ticketRepository.save(n);

        java.util.Optional<Seat> seatOptional = seatRepository.findById(seat);

        if (seatOptional.isPresent()) {
            Seat seatEntity = seatOptional.get();

            // Update the 'taken' attribute
            seatEntity.setTaken(true);

            // Save the updated Seat entity
            seatRepository.save(seatEntity);

            java.util.Optional<Flight> flightOptional = flightRepository.findById(flight);

            if (flightOptional.isPresent()) {
                Flight flightEntity = flightOptional.get();

                // Update the 'taken' attribute
                if (type.equals("ordinary")) {
                    flightEntity
                            .setOrdinarySeats(Integer.toString(Integer.valueOf(flightEntity.getOrdinarySeats()) - 1));
                } else if (type.equals("comfort")) {
                    flightEntity
                            .setComfortSeats(Integer.toString(Integer.valueOf(flightEntity.getComfortSeats()) - 1));
                } else if (type.equals("business")) {
                    flightEntity
                            .setBusinessSeats(Integer.toString(Integer.valueOf(flightEntity.getBusinessSeats()) - 1));
                }

                // Save the updated Seat entity
                seatRepository.save(seatEntity);
                String emailBody = (String.format(
                        "This is your details for your new ticket \nTicket for %s \nFrom %s -> %s \nDepature is %s at %s \n%s Seat: %s \nIf you need to cancel than use this ticket Id if prompted: %s",
                        name, origin, dest, depature, time, type, seatcode, Id));
                emailService.sendEmail(email, "New Ticket Booked", emailBody);

                String emailBody2 = (String.format(
                        "This is your receipt for your purchase \nName of individual: %s \nFinal Price: $ %s \nCerdit Card # used: %s ",
                        name, price, card));
                emailService.sendEmail(email, "Payment receipt", emailBody2);
                return ResponseEntity.ok("Ticket saved successfully");
            } else {
                // Handle the case where the seat is not found
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found");
            }
        } else {
            // Handle the case where the seat is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seat not found");
        }

    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteTicket(@PathVariable String id) {
        java.util.Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket tik = optionalTicket.get();
            java.util.Optional<Seat> optionalSeat = seatRepository.findById(tik.getSeat());
            Seat seatEntity = optionalSeat.get();
            seatEntity.setTaken(false);
            java.util.Optional<Flight> optionalFlight = flightRepository.findById(tik.getFlight());
            Flight fil = optionalFlight.get();

            if (seatEntity.getType().equals("ordinary")) {
                fil.setOrdinarySeats(Integer.toString(Integer.valueOf(fil.getOrdinarySeats()) + 1));
            } else if (seatEntity.getType().equals("comfort")) {
                fil.setComfortSeats(Integer.toString(Integer.valueOf(fil.getComfortSeats()) + 1));
            } else if (seatEntity.getType().equals("business")) {
                fil.setBusinessSeats(Integer.toString(Integer.valueOf(fil.getBusinessSeats()) + 1));
            }
            ticketRepository.deleteById(id);
            flightRepository.save(fil);
            seatRepository.save(seatEntity);
            String emailBody = (String.format(
                    "This is your details of the ticket just Cancelled \nTicket for %s \nFrom %s -> %s \nDepature is %s at %s \n%s Seat: %s \nThis ticket has been Cancelled",
                    tik.getName(), tik.getOrigin(), tik.getDest(), tik.getDepature(), tik.getTime(),
                    seatEntity.getType(), tik.getSeatcode()));
            emailService.sendEmail(tik.getEmail(), "Ticket has been cancelled", emailBody);
            return ResponseEntity.ok("Booking Deleted successfully");
        } else {
            // Handle the case where the seat is not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found");
        }
    }

}