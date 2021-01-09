import sendgrid from "@sendgrid/mail";
import config from "config";

const helper = sendgrid.mail;

class Mailer extends helper.Mail {}
