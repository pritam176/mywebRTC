package com.pkm.k8s.k8sUser;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pkm.k8s.k8sUser.model.SignalMessage;

public class WebSocketHandler extends TextWebSocketHandler {

	List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

	private ObjectMapper objectMapper = new ObjectMapper();

	private Map<String, WebSocketSession> clients = new HashMap<String, WebSocketSession>();
	// Thus map saves username by socket ID
	private Map<String, String> clientIds = new HashMap<String, String>();
	private static final String LOGIN_TYPE = "login";

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
			throws InterruptedException, IOException {
		System.out.println("===========");

		SignalMessage signalMessage = objectMapper.readValue(
				message.getPayload(), SignalMessage.class);
		System.out.println(signalMessage.getEvent()+"---"+signalMessage.getDest()+"---"+signalMessage.getIniteator());

		

		if (LOGIN_TYPE.equalsIgnoreCase(signalMessage.getEvent())) {
			// It's a login message so we assume data to be a String
			// representing the username
			String username = (String) signalMessage.getDest();

			WebSocketSession client = clients.get(username);

			// quick check to verify that the username is not already taken and
			// active
			if (client == null || !client.isOpen()) {

				// saves socket and username
				clients.put(username, session);
				clientIds.put(session.getId(), username);
			} else {

			}
			session.sendMessage(message);

		} else {
			String dest = signalMessage.getDest();
			WebSocketSession destSocket = clients.get(dest);
			destSocket.sendMessage(message);
		}
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session)
			throws Exception {
		sessions.add(session);
	}

}
