package com.pkm.k8s.k8sUser.controller;

import org.springframework.web.bind.annotation.GetMapping;

@org.springframework.web.bind.annotation.RestController
public class RestController {
	
	@GetMapping("/welcome")
	public String welcome(){
		return "From User App";
	}
	
	

}
