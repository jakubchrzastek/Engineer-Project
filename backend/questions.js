'use strict';

const crypto = require('crypto');
const secret = '482c811da5d5b4bc6d497ffa98491e38';

var Authenticated = function(req, res, next) {
    console.log("Sprawdzam token");
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }
    next();
}

app.get('/api/products/all/', Authenticated, function(req, res) {
    var id;
    database.query('SELECT p.id, p.nazwa, p.ilosc, p.cena, k.nazwa_kategoria, k.id as Kategorie FROM Produkt p left JOIN Kategorie as k on p.kategorie_id = k.id', function(error, rows) {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error with Database!');
        }
    });
});

app.get('/api/product/category', Authenticated, (req, res) => {
    database.query('SELECT * FROM Kategorie', function(error, rows) {
        res.json(rows);
    });
});

app.put('/api/products/save', Authenticated, function(req, res) {
    var editField = req.body.data;
    database.query('UPDATE Produkt SET nazwa="' + editField.nazwa + '", ilosc="' + editField.ilosc + '", cena="' + editField.cena + '", Kategorie_id = "' + editField.Kategorie + '" WHERE id="' + editField.id + '" ', function(error, rows) {
        if (!error) {
            res.sendStatus(200);
        } else {
            console.log('Error with Database!');
        }
    });
});

app.delete('/api/products/:id', Authenticated, function(req, res) {
    var productId = req.params.id;
    database.query('DELETE FROM Produkt WHERE id = ?', [productId], function(error, rows) {
        if (!error) {
            res.sendStatus(200);
        } else {}
    });
});

app.post('/api/products/add', Authenticated, function(req, res) {
    var newData = req.body.data;

    database.query('INSERT INTO Produkt SET nazwa = ?, Kategorie_id = ?, ilosc = ?, cena = ?',
        [newData.nazwa, newData.Kategorie, newData.ilosc, newData.cena], function(error, rows) {
            res.sendStatus(200);
    });
});

//dashboard

app.get('/api/dashboard/category', Authenticated, function(req, res) {
    database.query('SELECT k.nazwa_kategoria, COUNT( k.id ) AS ilosc FROM Kategorie AS k LEFT JOIN Produkt AS p ON k.id = p.Kategorie_id GROUP BY k.nazwa_kategoria', (error, rows) => {
        if (!error) {
            res.json(rows);
        } else
            console.log('Error with Database!:' + error);
    });
});

app.get('/api/dashboard/customers', Authenticated, function(req, res) {
    database.query('SELECT COUNT( * ) AS uzytkownicy FROM Uzytkownicy', (error, rows) => {
        if (!error) {
            res.json(rows[0].uzytkownicy);
        } else
            console.log('Error with Database!:' + error);
    });
});

app.get('/api/dashboard/products', Authenticated, function(req, res) {
    database.query('SELECT COUNT( Produkt.id ) AS produkty FROM Produkt', (error, rows) => {
        if (!error) {
            res.json(rows[0].produkty);
        } else
            console.log('Error with Database!:' + error);
    });
});

app.get('/api/dashboard/orders', Authenticated, function(req, res) {
    database.query('SELECT COUNT( Zamowienie.id ) AS zamowienia FROM Zamowienie', (error, rows) => {
        if (!error) {
            res.json(rows[0].zamowienia);
        } else
            console.log('Error with Database!:' + error);
    });
});

app.get('/api/dashboard/gain', Authenticated, function(req, res) {
    database.query('Select sum(zp.ilosc*p.cena) as gain from Zamowienie_Produkt zp left join Produkt p on zp.produkt_id=p.id', (error, rows) => {
        if (!error) {
            res.json(rows[0].gain);
            console.log(rows);
        } else
            console.log('Error with Database!:' + error);
    });
});

//customers

app.get('/api/customers/all', Authenticated, function(req, res) {
    database.query('SELECT u.id, u.login AS login, dk.imie, dk.nazwisko, dk.telefon, dk.miejscowosc FROM Dane_kontaktowe dk LEFT JOIN Uzytkownicy AS u on dk.Uzytkownicy_id = u.id', function(error, rows) {
        if (!error) {
            res.json(rows);
        } else
            console.log('Error with Database!:' + error);
    });
});


app.delete('/api/customers/:id', Authenticated, function(req, res) {
    var userId = req.params.id;
    database.query('DELETE FROM Uzytkownicy WHERE id = "' + userId + '" ', function(error, rows) {
        if (!error) {
            res.sendStatus(200);
        } else {
            console.log('Error with Database!:' + error);
        }
    });
});

app.post('/api/order/new', Authenticated, function(req, res) {
    var data = JSON.parse(req.body.data),
        cart = data.cart;

    database.query('INSERT INTO Zamowienie (Uzytkownicy_id) VALUES (' + data.userId + ')',
        (error, rows) => {
            if (error) {
                return error;
            }
            // wrzuć zamowiony order do danych koszyka
            cart.filter(function(item, key) {
                cart[key].orderId = rows.insertId;
            });

            // przygotuj dane do zapytania
            var prepareCartToSql = [];
            cart.map(function(item, key) {
                prepareCartToSql.push([item.orderId, item.productId, item.count]);
            })

            var sql = "INSERT INTO Zamowienie_Produkt (Zamowienie_id, Produkt_id, ilosc) VALUES ?";
            database.query(sql, [prepareCartToSql], (error, rows) => {});

        })
    res.sendStatus(200);
});

//order

app.post('/api/order/me', Authenticated, function(req, res) {
    var userId = req.body.userId;
    database.query('SELECT z.id, z.data, s.nazwa , uz.login FROM Zamowienie z left JOIN Statusy as s on z.Statusy_id = s.id left JOIN Uzytkownicy as uz on z.Uzytkownicy_id = uz.id WHERE uz.id =' + userId + ';', function(error, rows) {
        res.json(JSON.stringify(rows));
    });
})

//wszystkie zamowienia

app.get('/api/order/all', Authenticated, function(req, res) {

    database.query('SELECT z.id, z.data, s.nazwa , uz.login, dk.imie, dk.nazwisko FROM Zamowienie z left JOIN Statusy as s on z.Statusy_id = s.id left JOIN Uzytkownicy as uz on z.Uzytkownicy_id = uz.id left JOIN Dane_kontaktowe as dk on dk.Uzytkownicy_id = uz.id', function(error, rows) {
        res.json(JSON.stringify(rows));
    });
})

//szczegoly zamowienia

app.get('/api/order/:id', Authenticated, function(req, res) {
        var orderId = req.params.id;
        database.query('SELECT z.id, z.data, p.nazwa, p.cena, zp.ilosc, kat.nazwa_kategoria, dk.imie, dk. nazwisko, dk.miejscowosc, dk.telefon FROM Zamowienie_Produkt zp LEFT JOIN Zamowienie AS z ON zp.Zamowienie_id = z.id left JOIN Produkt as p ON zp.Produkt_id = p.id left JOIN Kategorie as kat ON p.Kategorie_id = kat.id left JOIN Dane_kontaktowe as dk ON z.Uzytkownicy_id = dk.Uzytkownicy_id WHERE z.id =' + orderId + ';', function(error, rows) {
            res.json({
                detail: rows
            });
        })
    })
//usuniecie zamowienia

app.delete('/api/order/:id', Authenticated, function(req, res) {
    var orderId = req.params.id;
    database.query('DELETE FROM Zamowienie WHERE id = ?', [orderId], function(error, rows) {
        if (!error) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });
});

//reset hasła

app.post('/api/customers/resetpassword', Authenticated, function(req, res) {
    var loginUser = req.body.login;
    var testpassword = "testpassword";
    var resetHaslo = crypto.createHmac('sha256', secret).update(testpassword).digest("hex");
    database.query('UPDATE Uzytkownicy SET haslo = "' + resetHaslo.toString('hex') + '" WHERE login = "' + loginUser + '";', (error) => {
        if (!error) {
            res.sendStatus(200);
        } else {
            console.log('Error with Database!:' + error);
        }

    });

});
//logowanie

app.post('/api/sign_in', (req, res) => {
    var loginUser = req.body.user.login;
    var loginPassword = crypto.createHmac('sha256', secret).
    update(req.body.user.password).digest("hex");
    database.query('SELECT * FROM Uzytkownicy WHERE login ="' + loginUser + '";', (error, rows) => {
        if (rows.length !== 0) {
            if (rows[0].haslo === loginPassword) {
                require('crypto').randomBytes(48, (err, token) => {
                    database.query('UPDATE Uzytkownicy SET token = "' + token.toString('hex') + '" WHERE login = "' + loginUser + '";', () => {
                        res.json({
                            user: {
                                rola: rows[0].rola,
                                token: token.toString('hex'),
                                id: rows[0].id
                            }
                        });
                    });
                });
            } else {
                res.sendStatus(403); // złe hasło (erorr)
            }
        } else {
            res.sendStatus(405); // nie ma takiego użytkownika
        }

    });
});

//rejestracja

app.post('/api/sign_up', function(req, res) {
    var userRegister = req.body.user;
    var hashPassword = crypto.createHmac('sha256', secret)
        .update(userRegister.password).digest("hex");

    database.query('INSERT INTO Uzytkownicy (login, haslo) VALUES ("' + userRegister.login + '", "' + hashPassword + '");',
        (error) => {
            if (!error) {
                res.sendStatus(200);
            } else {
                res.sendStatus(403);
            }
        });
});