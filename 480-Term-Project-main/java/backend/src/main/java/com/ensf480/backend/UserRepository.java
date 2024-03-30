package com.ensf480.backend;

import org.springframework.data.repository.CrudRepository;
import java.util.List;

import com.ensf480.backend.User;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface UserRepository extends CrudRepository<User, String> {
    List<User> findByNameAndPassword(String name, String password);
}
