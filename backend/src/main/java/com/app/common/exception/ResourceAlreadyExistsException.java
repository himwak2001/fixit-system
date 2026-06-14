package com.app.common.exception;

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String resourceName, String fieldName, String fieldValue){
        super(String.format("%s with %s '%s' already exists.", resourceName, fieldName, fieldValue));
    }
}
