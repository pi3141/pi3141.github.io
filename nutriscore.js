// FONCTION DE CALCUL DU NUTRISCORE 2023 PAR P.GAZANIOL
//v2023 https://www.santepubliquefrance.fr/content/download/150263/file/FAQ-updatedAlgo-EN_20231222.pdf#page=24
//or https://sante.gouv.fr/IMG/pdf/maj__rapport_nutri-score_rapport__algorithme_2022_.pdf#page=130

function compute_FNS(energy = 0, sugar = 0, saturated_fats = 0, salt = 0, proteins = 0, fibers = 0, fruits_vegetables_percentage = 0, red_meat = false, cheese = false) {
    var FNS_obj = {
        FNS: {
            class: undefined,
            score: '',
            AScore: 0,
            CScore: 0
        },
        energy: {
            value: energy,
            score: undefined
        },
        sugar: {
            value: sugar,
            score: undefined
        },
        saturated_fats: {
            value: saturated_fats,
            score: undefined
        },
        salt: {
            value: salt,
            score: undefined
        },
        proteins: {
            value: proteins,
            score: undefined
        },
        fibers: {
            value: fibers,
            score: undefined
        },
        fruits_vegetables_percentage: {
            value: fruits_vegetables_percentage,
            score: undefined
        },
        red_meat: red_meat,
        cheese: cheese
    }

    //energy
    FNS_obj.energy.score = (Math.ceil(FNS_obj.energy.value / 335) - 1);

    //sugar
    if (FNS_obj.sugar.value <= 3.4) { FNS_obj.sugar.score = 0; } else
        if (FNS_obj.sugar.value <= 6.8) { FNS_obj.sugar.score = 1; } else
            if (FNS_obj.sugar.value <= 10) { FNS_obj.sugar.score = 2; } else
                if (FNS_obj.sugar.value <= 14) { FNS_obj.sugar.score = 3; } else
                    if (FNS_obj.sugar.value <= 17) { FNS_obj.sugar.score = 4; } else
                        if (FNS_obj.sugar.value <= 20) { FNS_obj.sugar.score = 5; } else
                            if (FNS_obj.sugar.value <= 24) { FNS_obj.sugar.score = 6; } else
                                if (FNS_obj.sugar.value <= 27) { FNS_obj.sugar.score = 7; } else
                                    if (FNS_obj.sugar.value <= 31) { FNS_obj.sugar.score = 8; } else
                                        if (FNS_obj.sugar.value <= 34) { FNS_obj.sugar.score = 9; } else
                                            if (FNS_obj.sugar.value <= 37) { FNS_obj.sugar.score = 10; } else
                                                if (FNS_obj.sugar.value <= 41) { FNS_obj.sugar.score = 11; } else
                                                    if (FNS_obj.sugar.value <= 44) { FNS_obj.sugar.score = 12; } else
                                                        if (FNS_obj.sugar.value <= 48) { FNS_obj.sugar.score = 13; } else
                                                            if (FNS_obj.sugar.value <= 51) { FNS_obj.sugar.score = 14; } else
                                                                FNS_obj.sugar.score = 15;

    //saturated_fats
    FNS_obj.saturated_fats.score = (Math.max(Math.ceil(FNS_obj.saturated_fats.value) - 1), 0);

    //salt
    FNS_obj.salt.score = (Math.max((Math.ceil(FNS_obj.salt.value * 5) - 1), 0));

    //proteins
    if (FNS_obj.red_meat == true) {
        if (FNS_obj.proteins.value <= 2.4) { FNS_obj.proteins.score = 0; } else
            if (FNS_obj.proteins.value <= 4.8) { FNS_obj.proteins.score = 1; } else
                FNS_obj.proteins.score = 2;
    } else {
        if (FNS_obj.proteins.value <= 2.4) { FNS_obj.proteins.score = 0; } else
            if (FNS_obj.proteins.value <= 4.8) { FNS_obj.proteins.score = 1; } else
                if (FNS_obj.proteins.value <= 7.2) { FNS_obj.proteins.score = 2; } else
                    if (FNS_obj.proteins.value <= 9.6) { FNS_obj.proteins.score = 3; } else
                        if (FNS_obj.proteins.value <= 12) { FNS_obj.proteins.score = 4; } else
                            if (FNS_obj.proteins.value <= 14) { FNS_obj.proteins.score = 5; } else
                                if (FNS_obj.proteins.value <= 17) { FNS_obj.proteins.score = 6; } else
                                    FNS_obj.proteins.score = 7;
    }

    //fibers
    if (FNS_obj.fibers.value <= 3) { FNS_obj.fibers.score = 0; } else
        if (FNS_obj.fibers.value <= 4.1) { FNS_obj.fibers.score = 1; } else
            if (FNS_obj.fibers.value <= 5.2) { FNS_obj.fibers.score = 2; } else
                if (FNS_obj.fibers.value <= 6.3) { FNS_obj.fibers.score = 3; } else
                    if (FNS_obj.fibers.value <= 7.4) { FNS_obj.fibers.score = 4; } else
                        FNS_obj.fibers.score = 5;

    //fruits_vegetables_percentage
    if (FNS_obj.fruits_vegetables_percentage.value <= 40) { FNS_obj.fruits_vegetables_percentage.score = 0; } else
        if (FNS_obj.fruits_vegetables_percentage.value <= 60) { FNS_obj.fruits_vegetables_percentage.score = 1; } else
            if (FNS_obj.fruits_vegetables_percentage.value <= 80) { FNS_obj.fruits_vegetables_percentage.score = 2; } else
                FNS_obj.fruits_vegetables_percentage.score = 5;

    //AScore
    FNS_obj.FNS.AScore = FNS_obj.energy.score + FNS_obj.sugar.score + FNS_obj.saturated_fats.score + FNS_obj.salt.score;

    //CScore
    if (FNS_obj.FNS.AScore < 11 || cheese == true) {
        FNS_obj.FNS.CScore = FNS_obj.proteins.score + FNS_obj.fibers.score + FNS_obj.fruits_vegetables_percentage.score;
        FNS_obj.FNS.score = FNS_obj.FNS.AScore - FNS_obj.FNS.CScore
    } else {
        FNS_obj.FNS.score = FNS_obj.FNS.AScore - FNS_obj.fibers.score - FNS_obj.fruits_vegetables_percentage.score;
    }

    if (FNS_obj.FNS.score <= 0) { FNS_obj.FNS.class = 'A'; } else
        if (FNS_obj.FNS.score <= 2) { FNS_obj.FNS.class = 'B'; } else
            if (FNS_obj.FNS.score <= 10) { FNS_obj.FNS.class = 'C'; } else
                if (FNS_obj.FNS.score <= 18) { FNS_obj.FNS.class = 'D'; } else
                    FNS_obj.FNS.class = 'E';

    return (FNS_obj);
}
