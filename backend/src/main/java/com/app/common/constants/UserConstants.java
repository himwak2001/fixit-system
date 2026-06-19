package com.app.common.constants;

import java.util.UUID;

public class UserConstants {

    public static final String STATUS_201 = "201";
    public static final String MESSAGE_201 = "User sync successfully";
    public static final String STATUS_200 = "200";
    public static final String MESSAGE_200 = "Request processed successfully";
    public static final String STATUS_417 = "417";
    public static final String MESSAGE_417_UPDATE = "Update operation failed. Please try again or contact Dev team";
    public static final String MESSAGE_417_DELETE = "Delete operation failed. Please try again or contact Dev team";
    // private constructor to prevent initialization
    private UserConstants() {
    }

    public static String getSyncMessage(String id) {
        return MESSAGE_201 + " for ID: " + id + "!";
    }
}
