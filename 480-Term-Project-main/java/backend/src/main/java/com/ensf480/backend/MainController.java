package com.ensf480.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin
@Controller // This means that this class is a Controller
@RequestMapping(path = "/demo") // This means URL's start with /demo (after Application path)
public class MainController {
    @Autowired // This means to get the bean called userRepository
    // Which is auto-generated by Spring, we will use it to handle the data
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping(path = "/addUser") // Map ONLY POST Requests
    public @ResponseBody ResponseEntity<String> addNewUser(@RequestParam String Id, @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password, @RequestParam String Address, @RequestParam Integer type,
            @RequestParam Boolean Promo) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        User n = new User();
        n.setId(Id);
        n.setName(name);
        n.setEmail(email);
        n.setPassword(password);
        n.setType(type);
        n.setAddress(Address);
        n.setPromo(Promo);
        n.setFreeflight(Promo);
        userRepository.save(n);
        return ResponseEntity.ok("User saved successfully");
    }

    @CrossOrigin
    @GetMapping(path = "/all")
    public @ResponseBody Iterable<User> getAllUsers() {
        // This returns a JSON or XML with the users
        return userRepository.findAll();
    }

    @CrossOrigin
    @GetMapping(path = "/login")
    public @ResponseBody List<User> getUser(@RequestParam String name, @RequestParam String password) {
        // Use the Spring Data JPA repository method to find users by name
        return userRepository.findByNameAndPassword(name, password);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        java.util.Optional<User> optionaluser = userRepository.findById(id);

        if (optionaluser.isPresent()) {
            userRepository.deleteById(id);
            return new ResponseEntity<>("Account deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin
    @GetMapping(path = "/free/{id}")
    public ResponseEntity<String> changeFreeFlight(@PathVariable String id) {
        // This returns a JSON or XML with the users
        java.util.Optional<User> optionaluser = userRepository.findById(id);
        if (optionaluser.isPresent()) {
            User u = optionaluser.get();
            u.setFreeflight(!(u.getFreefight()));
            return new ResponseEntity<>("Changed", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin
    @GetMapping(path = "/promo/{id}")
    public ResponseEntity<String> changePromo(@PathVariable String id) {
        // This returns a JSON or XML with the users
        java.util.Optional<User> optionaluser = userRepository.findById(id);
        if (optionaluser.isPresent()) {
            User u = optionaluser.get();
            u.setPromo(!(u.getPromo()));
            u.setFreeflight(true);
            userRepository.save(u);
            return new ResponseEntity<>("Changed", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin
    @PostMapping(path = "/news")
    public ResponseEntity<String> changeSendnews(@RequestParam String newsbody) {
        Iterable<User> userlist = userRepository.findAll();
        for (User user : userlist) {
            if (user.getPromo()) {
                emailService.sendEmail(user.getEmail(), "Monthy Promotion News", newsbody);
            }
        }
        return new ResponseEntity<>("News Sent", HttpStatus.OK);
    }
}