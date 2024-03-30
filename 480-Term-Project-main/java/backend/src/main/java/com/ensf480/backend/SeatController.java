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
@RequestMapping("/seat")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class SeatController {
    @Autowired
    private SeatRepository seatRepository;

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Seat> getAllSeats() {
        // This returns a JSON or XML with the users
        return seatRepository.findAll();
    }

    @PostMapping(path = "/add") // Map ONLY POST Requests
    public @ResponseBody ResponseEntity<String> addNewSeat(@RequestParam String Id, @RequestParam String flight,
            @RequestParam String code, @RequestParam String type) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Seat n = new Seat();
        n.setId(Id);
        n.setCode(code);
        n.setFlight(flight);
        n.setTaken(false);
        n.setType(type);
        seatRepository.save(n);
        return ResponseEntity.ok("seat saved successfully");
    }

    @GetMapping(path = "/{flight}")
    public @ResponseBody Iterable<Seat> getSeats(@PathVariable String flight) {
        // This returns a JSON or XML with the users
        return seatRepository.findByFlight(flight);
    }
}