import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:area_front/sources/reaction.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/components/textfield.dart';
import 'package:area_front/sources/components/datefield.dart';
import 'package:area_front/sources/components/choicefield.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'package:area_front/sources/components/bottom_navigation.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class DataScheme extends StatefulWidget {
  const DataScheme(
      {required this.areaName,
      required this.areaDescription,
      required this.userData,
      required this.data,
      required this.name,
      required this.dataType,
      required this.token,
      required this.scheme,
      required this.index,
      super.key});

  final List data;
  final String name, dataType, token, areaName, areaDescription;
  final Map<String, dynamic> scheme;
  final Map<dynamic, dynamic> userData;
  final int index;

  @override
  State<DataScheme> createState() => _DataSchemeState();
}

class _DataSchemeState extends State<DataScheme> {
  int widgetIndex = 0;
  Map? dropDownValue = {};
  Map newDropDownValue = {};
  String firstServerId = "";
  String serverId = "";
  Map<dynamic, dynamic> userData = {};
  List<Widget> widgetList = [];

  void _areaSchematic() async {
    final url = Uri.http(kIsWeb ? 'localhost:8080' : '10.0.2.2:8080', '/area');
    final String reqBody = json.encode(widget.scheme);
    print('sending area : $reqBody, ${reqBody.length}');
    final response = await http.post(url,
        headers: <String, String>{
          'token': widget.token,
          'Content-Type': 'application/json'
        },
        body: json.encode(widget.scheme));
    print('AREA : ${response.body}');
    print('DataScheme : ${widget.scheme}');
    if (response.statusCode == 201) {
      setState(() {
        const snackBar = SnackBar(content: Text('Area created !'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    BottomNavigation(userData: userData, token: widget.token)));
      });
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('Could not create area'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    BottomNavigation(userData: userData, token: widget.token)));
      });
    }
  }

  void _populateSchematic() {
    print('index ${widget.index}');
    widget.scheme[widget.dataType]['id'] = widget.data[widget.index]['_id'];
    if (widget.dataType == 'action') {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => Reaction(
                    areaName: widget.areaName,
                    areaDescription: widget.areaDescription,
                    userData: userData,
                    token: widget.token,
                    scheme: widget.scheme,
                  )));
    } else {
      _areaSchematic();
    }
  }

  @override
  void initState() {
    super.initState();
    userData = widget.userData;
    widget.scheme['name'] = widget.areaName;
    widget.scheme['description'] = widget.areaDescription;
    widget.scheme.addAll({widget.dataType: {}});
    widget.scheme[widget.dataType]['data'] = {};
  }

  @override
  Widget build(BuildContext context) {
    widgetIndex = 0;
    final List entryList =
        widget.data[widget.index]['dataScheme'].keys.toList();
    print('dataScheme ${widget.data[widget.index]["dataScheme"]}');
    print('entrList lenght ${entryList.length}');
    // print('data ${widget.scheme[widget.dataType]['data']}');
    for (final element in widget.data[widget.index]['dataScheme'].values) {
      print('element $element');
      switch (element['type']) {
        case 'string':
          widgetList.add(Container(
            margin: const EdgeInsets.all(15.0),
            child: MyTextField(
                index: widgetIndex,
                name: entryList[widgetIndex],
                dataScheme: widget.data[widget.index]['dataScheme'],
                data: widget.scheme[widget.dataType]['data']),
          ));
          break;
        case 'choice':
          element['choices'].isNotEmpty
              ? dropDownValue = element['choices'][0]
              : dropDownValue;
          element['choices'].isNotEmpty
              ? firstServerId = element['choices'][0]['value']
              : firstServerId;
          widget.scheme[widget.dataType]['data'][entryList[widgetIndex]] = firstServerId;
          widgetList.add(Container(
            margin: const EdgeInsets.all(15.0),
            child: MyChoiceField(
                index: widgetIndex,
                name: entryList[widgetIndex],
                dropDownValue: dropDownValue!,
                newDropDownValue: newDropDownValue,
                dataScheme: widget.data[widget.index]['dataScheme'],
                data: widget.scheme[widget.dataType]['data']),
          ));
          break;
        case 'date':
          widgetList.add(Container(
            margin: const EdgeInsets.all(15.0),
            child: MyDateField(
                name: entryList[widgetIndex],
                data: widget.scheme[widget.dataType]['data']),
          ));
          break;
      }
      widgetIndex++;
      print('for widgetIndex $widgetIndex');
    }
    print('end of for');
    widgetList.add(
      Container(
        margin: const EdgeInsets.all(30.0),
        child: MyElevatedButton(
          gradient: themedGradient,
          borderRadius: BorderRadius.circular(30),
          onPressed: _populateSchematic,
          child: const Text('build'),
        ),
      ),
    );

    print('after build');

    return Container(
      decoration: const BoxDecoration(gradient: themedGradient),
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        appBar: AppBar(
          backgroundColor: Colors.white,
          centerTitle: true,
          automaticallyImplyLeading: false,
          shadowColor: Theme.of(context).colorScheme.shadow,
          title: GradientText(
            widget.name,
            gradient: themedGradient,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
          ),
        ),
        backgroundColor: Colors.transparent,
        body: Container(
            margin: const EdgeInsets.all(15.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(30),
            ),
            child: ListView(children: widgetList)),
      ),
    );
  }
}
