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
@RequestMapping("/aircraft")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class AircraftController {
    @Autowired
    private AircraftRepository aircraftRepository;

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Aircraft> getAllUsers() {
        // This returns a JSON or XML with the users
        return aircraftRepository.findAll();
    }

    @PostMapping(path = "/add") // Map ONLY POST Requests
    public @ResponseBody ResponseEntity<String> addNewUser(@RequestParam String Id, @RequestParam String name,
            @RequestParam String type) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Aircraft n = new Aircraft();
        n.setId(Id);
        n.setName(name);
        n.setType(type);
        aircraftRepository.save(n);
        return ResponseEntity.ok("User saved successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAircraft(@PathVariable String id) {
        java.util.Optional<Aircraft> optionalAircraft = aircraftRepository.findById(id);

        if (optionalAircraft.isPresent()) {
            aircraftRepository.deleteById(id);
            return new ResponseEntity<>("Aircraft deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Aircraft not found", HttpStatus.NOT_FOUND);
        }
    }

}