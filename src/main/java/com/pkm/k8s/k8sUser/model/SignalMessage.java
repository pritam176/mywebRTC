/**
 * 
 */
package com.pkm.k8s.k8sUser.model;

/**
 * @author RIKI
 *
 */
public class SignalMessage {

	private String event;
	private String dest;
	private Object data;
	private String initeator;

	

	public String getDest() {
		return dest;
	}

	public void setDest(String dest) {
		this.dest = dest;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public String getIniteator() {
		return initeator;
	}

	public void setIniteator(String initeator) {
		this.initeator = initeator;
	}
}
