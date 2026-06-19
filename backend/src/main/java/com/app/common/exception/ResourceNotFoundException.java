package com.app.common.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue){
        super(String.format("%s with %s '%s' does not exists.", resourceName, fieldName, fieldValue));
    }
}
