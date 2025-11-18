
Vue d’ensemble

Ce projet Angular affiche des statistiques olympiques à partir d’un fichier JSON local


📂 Structure du projet

    src/
    ├── app/
    │    ├── components/
    │    │      └── chart/
    │    │            ├── country-chart/
    │    │            └── medal-chart/
    │    │
    │    ├── models/
    │    │      └── olympic.model.ts
    │    │
    │    ├── pages/
    │    │      ├── home/
    │    │      ├── country/
    │    │      └── not-found/
    │    │
    │    └── services/
    │           └── olympic.service.ts
    │
    └── assets/
            └── mock/olympic.json



📘 Détail des dossiers

    📁 components/chart/

        Contient les composants graphiques réutilisables basés sur Chart.js.

    ✔ country-chart/

        Affiche la répartition des médailles par pays dans un Pie chart.
        C’est un composant générique qui reçoit :

        une liste de pays

        une liste de valeurs (médailles)

        des couleurs

        un label

        un event (countrySelected) émis au clic

        Utilisé dans la page Home.

    ✔ medal-chart/

        Affiche l’évolution des médailles d’un pays dans un Line chart.
        Utilisé dans la page Country.

    ➕ Avantages

        Composants isolés et réutilisables

        Les pages ne contiennent aucun code Chart.js

        Favorise la maintenance et les tests    

    📁 models/
    ✔ olympic.model.ts

        Contient les structures de données du projet :

        CountryDataJSON : interface utilisée pour lire les données brutes depuis le JSON

        Participation : classe représentant une participation aux JO

        CountryData : classe contenant les participations + des propriétés calculées (ex : totalMedals)

    ➕ Avantages

        Mappage clair entre JSON brut et objets métier typés

        Encapsulation des calculs (total médailles, total athlètes…)

        Facilite l’évolution en cas d’API réelle

    📁 pages/

    Contient les vues affichables avec routing.

    ✔ home/

        Affiche le tableau de bord global :

        nombre total de pays

        nombre total de JO

        Pie Chart des médailles par pays (via CountryChartComponent)

    ✔ country/

        Affiche les statistiques détaillées d’un pays :

        total des participations

        total des médailles

        total des athlètes

        Line Chart (via MedalChartComponent)

    Utilise le paramètre de route :countryName.

    ✔ not-found/

        Page 404 simple.


    📁 services/
    ✔ olympic.service.ts

    Service singleton qui gère toutes les données olympiques.
    Il centralise :

        le chargement du fichier JSON

        la création des objets métier (CountryData, Participation)

        le cache interne via shareReplay(1)

        la récupération d’un pays spécifique

    ➕ Avantages

        Chargement unique du JSON

        Service facilement remplaçable par une API REST

        Fournit une API claire pour les composants

        
