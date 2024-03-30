package com.ensf480.backend;

import org.hibernate.mapping.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flights")
public class Flight {
    @Id
    private String id;

    private String flightNumber;
    private String origin;
    private String destination;
    private String departureDate;
    private String departureTime;
    private String arrival;
    private String aircraft; // aircraft id
    private String OrdinarySeats;
    private String ComfortSeats;
    private String BusinessSeats;
    private String returnDate;
    private String ordinaryFare; // New column
    private String crew;
    // Add other fields as needed

    // Constructors, getters, and setters

    // Default constructor

    // Getters and setters for private members
    public String getOrdinaryFare() {
        return ordinaryFare;
    }

    public void setOrdinaryFare(String ordinaryFare) {
        this.ordinaryFare = ordinaryFare;
    }

    public String getReturnDate() {
        return returnDate;
    }

    // Setter for returnDate
    public void setReturnDate(String returnDate) {
        this.returnDate = returnDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(String departure) {
        this.departureDate = departure;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departure) {
        this.departureTime = departure;
    }

    public String getArrival() {
        return arrival;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
    }

    public String getAircraft() {
        return aircraft;
    }

    public void setAircraft(String aircraft) {
        this.aircraft = aircraft;
    }

    public String getOrdinarySeats() {
        return OrdinarySeats;
    }

    // Setter for OrdinarySeats
    public void setOrdinarySeats(String ordinarySeats) {
        this.OrdinarySeats = ordinarySeats;
    }

    // Getter for ComfortSeats
    public String getComfortSeats() {
        return ComfortSeats;
    }

    // Setter for ComfortSeats
    public void setComfortSeats(String comfortSeats) {
        this.ComfortSeats = comfortSeats;
    }

    // Getter for BusinessSeats
    public String getBusinessSeats() {
        return BusinessSeats;
    }

    // Setter for BusinessSeats
    public void setBusinessSeats(String businessSeats) {
        this.BusinessSeats = businessSeats;
    }

    public String getCrew() {
        return crew;
    }

    public void addCrew(String member) {
        this.crew = String.format("%s,%s", this.crew, member);
    }

    public void changeCrew(String newcrew) {
        this.crew = newcrew;
    }
    // Add getters and setters for other fields as needed
}
