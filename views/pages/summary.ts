export const webpage =
    '<h1>The <%= it.family.name %> Family</h1> <h3>Question: <%= it.topic.prompt %></h3><h4>Responses:<h4><ul> <% for (const response of it.topic.responses) { %> <li> <%= response.text %></li> <% } %> </ul>';
