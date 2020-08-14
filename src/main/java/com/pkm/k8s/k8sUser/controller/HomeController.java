/**
 * 
 */
package com.pkm.k8s.k8sUser.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author RIKI
 *
 */
@Controller
public class HomeController {
	
	@GetMapping("/greeting")
	public String greeting( Model model) {
		model.addAttribute("name", "Hi");
		return "test";
	}
	
	@GetMapping("/greetingRTC")
	public String greetingRTC( Model model) {
		model.addAttribute("name", "Hi");
		return "test2";
	}
	
	@GetMapping("/p2pchat")
	public String greetingRTC2( Model model) {
		model.addAttribute("name", "Hi");
		return "p2pchat";
	}

}
