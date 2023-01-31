import 'package:area_front/sources/action.dart' as screen;
import 'package:area_front/sources/components/bottom_navigation.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:flutter/material.dart';

class Area extends StatelessWidget {
  Area({required this.token, required this.userData, super.key});
  final String token;
  final Map<dynamic, dynamic> userData;

  final TextEditingController _nameTextController = TextEditingController();
  final TextEditingController _descriptionTextController =
      TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        backgroundColor: Colors.white,
        centerTitle: true,
        shadowColor: Theme.of(context).colorScheme.shadow,
        title: const GradientText(
          'AREA',
          gradient: themedGradient,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
        ),
      ),
      backgroundColor: Colors.white,
      body: Column(children: [
        Expanded(
          child: Container(
            margin: const EdgeInsets.only(
                top: 50.0, left: 25.0, bottom: 25.0, right: 25.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Container(
                  child: Column(
                    children: [
                      const Align(
                          alignment: Alignment.topLeft, child: Text('Name')),
                      TextFormField(
                        controller: _nameTextController,
                        decoration: const InputDecoration(
                            hintText: "Un push à été effectué"),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Invalid name';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                Container(
                  child: Column(
                    children: [
                      const Align(
                          alignment: Alignment.topLeft,
                          child: Text('Description')),
                      TextFormField(
                        controller: _descriptionTextController,
                        decoration: const InputDecoration(
                            hintText:
                                "Prévient sur discord qu'un push a été effectué"),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Invalid description';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                MyElevatedButton(
                  borderRadius: BorderRadius.circular(30),
                  gradient: themedGradient,
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => screen.Action(
                                areaName: _nameTextController.text,
                                areaDescription:
                                    _descriptionTextController.text,
                                userData: userData,
                                token: token)));
                  },
                  child: const Text('Begin'),
                )
              ],
            ),
          ),
        ),
      ]),
    );
  }
}
