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
@RequestMapping("/airport")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class AirportController {
    @Autowired
    private AirportRepository airportRepository;

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Airport> getAllAirports() {
        // This returns a JSON or XML with the users
        return airportRepository.findAll();
    }

    @PostMapping(path = "/add") // Map ONLY POST Requests
    public @ResponseBody ResponseEntity<String> addNewAiport(@RequestParam String Id, @RequestParam String code,
            @RequestParam String city) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Airport n = new Airport();
        n.setId(Id);
        n.setCode(code);
        n.setCity(city);
        airportRepository.save(n);
        return ResponseEntity.ok("User saved successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAirport(@PathVariable String id) {
        java.util.Optional<Airport> optionalAirport = airportRepository.findById(id);

        if (optionalAirport.isPresent()) {
            airportRepository.deleteById(id);
            return new ResponseEntity<>("Airport deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Airport not found", HttpStatus.NOT_FOUND);
        }
    }

}