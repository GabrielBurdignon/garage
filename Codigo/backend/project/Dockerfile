FROM eclipse-temurin:21-jdk-alpine

COPY target/project-0.0.1-SNAPSHOT.jar /app/project.jar

WORKDIR /app

ENTRYPOINT ["java", "-jar", "project.jar"]

EXPOSE 8080