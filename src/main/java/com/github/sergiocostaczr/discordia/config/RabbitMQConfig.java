package com.github.sergiocostaczr.discordia.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.*;
import org.springframework.context.annotation.*;

@Configuration
public class RabbitMQConfig {

    public static final String CHAT_EXCHANGE = "chat.exchange";
    public static final String CHAT_QUEUE    = "chat.queue";
    public static final String CHAT_RK       = "room.#";

    public static final String GAME_EXCHANGE = "game.exchange";
    public static final String GAME_QUEUE    = "game.queue";
    public static final String GAME_RK       = "game.*";

    @Bean
    public TopicExchange chatExchange() {
        return new TopicExchange(CHAT_EXCHANGE);
    }

    @Bean
    public Queue chatQueue() {
        return QueueBuilder.durable(CHAT_QUEUE).build();
    }

    @Bean
    public Binding chatBinding() {
        return BindingBuilder.bind(chatQueue()).to(chatExchange()).with(CHAT_RK);
    }

    @Bean
    public DirectExchange gameExchange() {
        return new DirectExchange(GAME_EXCHANGE);
    }

    @Bean
    public Queue gameQueue() {
        return QueueBuilder.durable(GAME_QUEUE).build();
    }

    @Bean
    public Binding gameBinding() {
        return BindingBuilder.bind(gameQueue()).to(gameExchange()).with(GAME_RK);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        var template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}