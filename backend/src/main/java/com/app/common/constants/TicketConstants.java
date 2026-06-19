package com.app.common.constants;

public class TicketConstants {
    public static final String STATUS_201 = "201";
    public static final String MESSAGE_201 = "Ticket created successfully";
    public static final String STATUS_200 = "200";
    public static final String MESSAGE_200 = "Request processed successfully";
    public static final String STATUS_417 = "417";
    public static final String MESSAGE_417_UPDATE = "Update operation failed. Please try again or contact Dev team";
    public static final String MESSAGE_417_DELETE = "Delete operation failed. Please try again or contact Dev team";

    private TicketConstants(){

    }

    public static String getSyncMessage(String id) {
        return MESSAGE_201 + " with ID: " + id + "!";
    }
}
