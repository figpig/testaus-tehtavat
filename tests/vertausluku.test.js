import laskeVertausluvut from "../vertausluku.js";
import ehdokasRekisteri from "../ehdokasRekisteri.js";

import { afterEach, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";

describe("laskeVertausluvut", () => {
  beforeEach(() => {
    const lista = [
      { numero: 101, nimi: "Maija Meikäläinen", aanet: 1 },
      { numero: 102, nimi: "Kalle Korhonen", aanet: 4 },
      { numero: 103, nimi: "Sari Virtanen", aanet: 2 },
      { numero: 104, nimi: "Jukka Jokinen", aanet: 5 },
    ];

    mock.method(ehdokasRekisteri, "haeLista", () => lista);
  });

  afterEach(() => {
    mock.reset(ehdokasRekisteri.haeLista);
  });

  it("listan eniten ääniä saaneen ehdokkaan vertausluku on listan äänten summa", () => {
    const tulos = laskeVertausluvut(ehdokasRekisteri.haeLista(1));
    assert.equal(tulos[0].vertausluku, 12);
  });

  it("listan toiseksi eniten ääniä saaneen ehdokkaan vertausluku on puolet listan äänien summasta", () => {
    const tulos = laskeVertausluvut(ehdokasRekisteri.haeLista(1));
    assert.equal(tulos[1].vertausluku, 6);
  });

  it("merkitsee saman äänimäärän saaneille arvottu-kentän arvoksi true", () => {
    const lista = [
      { numero: 201, nimi: "Ehdokas X", aanet: 3 },
      { numero: 202, nimi: "Ehdokas Y", aanet: 3 },
      { numero: 203, nimi: "Ehdokas Z", aanet: 1 },
    ];
    mock.method(ehdokasRekisteri, "haeLista", () => lista);
    const tulos = laskeVertausluvut(ehdokasRekisteri.haeLista(1));
    const tiedCandidates = tulos.filter((e) => e.aanet === 3);

    assert.strictEqual(tiedCandidates.length, 2);
    tiedCandidates.forEach((ehdokas) => {
      assert.strictEqual(ehdokas.arvottu, true);
    });
  });

  it("arpoo saman äänimäärän ehdokkaiden järjestyksen useilla ajoilla", () => {
    const lista = [
      { numero: 301, nimi: "Ehdokas A", aanet: 2 },
      { numero: 302, nimi: "Ehdokas B", aanet: 2 },
      { numero: 303, nimi: "Ehdokas C", aanet: 1 },
    ];
    const uniqueOrders = new Set();

    for (let i = 0; i < 10; i++) {
      const tulos = laskeVertausluvut(lista);
      const tiedCandidates = tulos.filter((e) => e.aanet === 2);

      tiedCandidates.forEach((ehdokas) => {
        assert.strictEqual(ehdokas.arvottu, true);
      });

      uniqueOrders.add(tiedCandidates.map((e) => e.numero).join(","));
    }

    assert.ok(
      uniqueOrders.size > 1,
      "Saman äänimäärän ehdokkaiden järjestys ei vaihtele"
    );
  });
});