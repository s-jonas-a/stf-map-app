package com.example.map_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class MapBackendApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(MapBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("STARTED !!!!! args: " + args.length);
	}
}
